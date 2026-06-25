'use client';

import { FileText, Copyright, AlertTriangle, Link2, RefreshCw } from "lucide-react";
import AccordionCards, { type AccordionItem } from "@/components/ui/accordion-cards";

const ICON = "h-5 w-5";

const ITEMS: AccordionItem[] = [
    {
        id: "genel",
        title: "Genel Hükümler",
        icon: <FileText className={ICON} />,
        body: (
            <>
                <p>
                    Bu web sitesini kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.
                    Site, Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları ve Dayanışma Derneği
                    tarafından işletilmektedir. Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.
                </p>
            </>
        ),
    },
    {
        id: "fikri-mulkiyet",
        title: "Fikri Mülkiyet Hakları",
        icon: <Copyright className={ICON} />,
        body: (
            <>
                <p>
                    Sitedeki yazı, görsel, logo ve diğer içeriklerin tüm hakları Derneğe veya ilgili hak
                    sahiplerine aittir. İçerikler, kaynak gösterilmeden ve izin alınmadan kopyalanamaz,
                    çoğaltılamaz veya ticari amaçla kullanılamaz.
                </p>
            </>
        ),
    },
    {
        id: "sorumluluk",
        title: "Sorumluluğun Sınırlandırılması",
        icon: <AlertTriangle className={ICON} />,
        body: (
            <>
                <p>
                    Sitedeki bilgiler bilgilendirme amaçlıdır. İçeriklerin güncelliği için azami özen
                    gösterilse de, oluşabilecek hata veya eksikliklerden doğan zararlardan Dernek sorumlu
                    tutulamaz. Site kesintisiz veya hatasız olacağı garanti edilmez.
                </p>
            </>
        ),
    },
    {
        id: "baglantilar",
        title: "Dış Bağlantılar",
        icon: <Link2 className={ICON} />,
        body: (
            <>
                <p>
                    Sitemiz, üçüncü taraf sitelere (ör. YouTube, harita servisleri) bağlantılar
                    içerebilir. Bu sitelerin içeriklerinden ve gizlilik uygulamalarından Dernek sorumlu
                    değildir.
                </p>
            </>
        ),
    },
    {
        id: "degisiklik",
        title: "Şartlardaki Değişiklikler",
        icon: <RefreshCw className={ICON} />,
        body: (
            <>
                <p>
                    Dernek, bu kullanım şartlarını dilediği zaman güncelleme hakkını saklı tutar. Güncel
                    sürüm her zaman bu sayfada yayımlanır. Sorularınız için{" "}
                    <a href="/iletisim" className="font-semibold text-red-900 underline underline-offset-2">iletişim</a>{" "}
                    sayfamızdan bize ulaşabilirsiniz.
                </p>
            </>
        ),
    },
];

export default function TermsAccordion() {
    return <AccordionCards items={ITEMS} />;
}
