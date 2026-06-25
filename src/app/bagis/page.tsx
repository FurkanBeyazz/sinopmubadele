import { Metadata } from "next";
import { Heart, BookOpen, Users, HandHeart } from "lucide-react";
import IbanCard from "./_components/iban-card";

export const metadata: Metadata = {
    title: "Bağış Yap | Sinop Mübadele ve Balkan Halkları Derneği",
    description:
        "Derneğimizin kültürel miras çalışmalarına ve dayanışma faaliyetlerine bağışlarınızla destek olabilirsiniz.",
};

/*
  ⚠️ DÜZENLEYİN: Aşağıdaki banka/IBAN bilgilerini derneğin gerçek hesap
  bilgileriyle değiştirin. Birden fazla hesap eklemek için diziye yeni
  nesne ekleyebilirsiniz.
*/
const hesaplar = [
    {
        banka: "Ziraat Bankası",
        hesapSahibi: "Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları ve Dayanışma Derneği",
        iban: "TR00 0000 0000 0000 0000 0000 00",
    },
    // {
    //     banka: "Diğer Banka",
    //     hesapSahibi: "Sinop Mübadele ... Derneği",
    //     iban: "TR00 0000 0000 0000 0000 0000 00",
    // },
];

const destekAlanlari = [
    { icon: BookOpen, baslik: "Kültürel Miras", metin: "Sözlü tarih, arşiv ve yayın çalışmalarımız." },
    { icon: Users, baslik: "Dayanışma", metin: "Sosyal yardımlaşma ve topluluk etkinlikleri." },
    { icon: HandHeart, baslik: "Eğitim & Etkinlik", metin: "Konferans, sergi ve eğitim programları." },
];

export default function BagisPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Başlık Alanı */}
            <section className="relative overflow-hidden bg-gradient-to-br from-red-950 to-[#1E3A5F] py-20 text-center text-white md:py-28">
                <div className="container mx-auto px-4">
                    <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                        <Heart className="h-8 w-8 fill-white/20" />
                    </div>
                    <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">
                        Bağışlarınızla Yaşatıyoruz
                    </h1>
                    <p className="mx-auto max-w-2xl text-white/80">
                        Kültürel mirasımızı geleceğe taşıyan çalışmalarımıza ve dayanışma
                        faaliyetlerimize katkıda bulunmak için bağış yapabilirsiniz.
                    </p>
                </div>
            </section>

            <div className="container mx-auto max-w-4xl px-4 py-16">
                {/* Destek alanları */}
                <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {destekAlanlari.map((d) => (
                        <div key={d.baslik} className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-900">
                                <d.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-1 font-serif text-lg font-bold text-slate-900">{d.baslik}</h3>
                            <p className="text-sm text-slate-500">{d.metin}</p>
                        </div>
                    ))}
                </div>

                {/* Banka / IBAN bilgileri */}
                <div className="mb-10 text-center">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Banka Hesap Bilgileri</span>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 md:text-3xl">
                        Banka Havalesi / EFT
                    </h2>
                    <div className="mt-3 flex items-center justify-center gap-3 opacity-80">
                        <div className="h-px w-10 bg-slate-300" />
                        <div className="h-2 w-2 rotate-45 bg-red-900" />
                        <div className="h-px w-10 bg-slate-300" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {hesaplar.map((h, i) => (
                        <IbanCard key={i} banka={h.banka} hesapSahibi={h.hesapSahibi} iban={h.iban} />
                    ))}
                </div>

                {/* Bilgilendirme notu */}
                <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-800">
                    Bağışınızın açıklama kısmına <strong>“Bağış”</strong> yazmanız ve dekontunuzu
                    bizimle paylaşmanız, kayıtlarımızın sağlıklı tutulması açısından önemlidir.
                    Sorularınız için <a href="/iletisim" className="font-semibold underline underline-offset-2">iletişim</a> sayfamızdan bize ulaşabilirsiniz.
                </div>
            </div>
        </div>
    );
}
