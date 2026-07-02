import { getMembers } from "@/actions/member-actions";
import OrgChart from "./_components/org-chart";

export const dynamic = "force-dynamic";

export default async function ManagementPage() {
    const members = await getMembers();

    return (
        <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden">
            {/* Premium Arka Plan Efekti (Subtle Glow) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl relative z-10">
                {/* Editorial Başlık Alanı */}
                <header className="mb-16 text-center">
                    <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 block">
                        Kurumsal Bilgi
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1A202C] mb-6 tracking-tight">
                        Yönetim Kurulu
                    </h1>

                    {/* Klasik/Zarif Ayraç (Ornamental Divider) */}
                    <div className="flex items-center justify-center gap-4 opacity-80">
                        <div className="h-[1px] w-12 bg-slate-300"></div>
                        <div className="w-2 h-2 rotate-45 bg-primary"></div>
                        <div className="h-[1px] w-12 bg-slate-300"></div>
                    </div>
                </header>

                {/* Yönetim Şeması (Org Chart) */}
                <div className="mb-4 text-center">
                    <p className="text-sm text-slate-500">
                        Başkan yardımcısına tıklayarak bağlı müdürlükleri görüntüleyebilirsiniz.
                    </p>
                </div>
                <OrgChart members={members as any} />
            </div>
        </div>
    );
}
