'use client';

import { FileText, ShieldCheck, Cookie, UserCheck, PenLine } from "lucide-react";
import AccordionCards, { type AccordionItem } from "@/components/ui/accordion-cards";

const ICON = "h-5 w-5";

const ITEMS: AccordionItem[] = [
    {
        id: "aydinlatma",
        title: "KVKK Aydınlatma Metni",
        icon: <FileText className={ICON} />,
        body: (
            <>
                <p>
                    Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları ve Dayanışma Derneği
                    (“Dernek”), veri sorumlusu sıfatıyla kişisel verilerinizi 6698 sayılı KVKK
                    kapsamında işlemektedir.
                </p>
                <p className="font-semibold text-slate-800">İşlenen Veriler</p>
                <ul>
                    <li><strong>İletişim formu:</strong> ad soyad, e-posta, konu ve mesaj içeriği.</li>
                    <li><strong>Anı/içerik gönderimi:</strong> ad soyad ve paylaştığınız görsel/not.</li>
                    <li><strong>Teknik veriler:</strong> güvenlik amacıyla IP ve tarayıcı bilgisi gibi sınırlı loglar.</li>
                </ul>
                <p className="font-semibold text-slate-800">İşleme Amaçları ve Hukuki Sebep</p>
                <p>
                    Verileriniz; iletişim taleplerinizi yanıtlamak, derneğin kültürel ve dayanışma
                    faaliyetlerini yürütmek, site güvenliğini sağlamak ve yasal yükümlülükleri yerine
                    getirmek amaçlarıyla, KVKK m.5 ve m.6'da belirtilen hukuki sebeplere dayanılarak işlenir.
                </p>
            </>
        ),
    },
    {
        id: "bilgi-guvenligi",
        title: "Bilgi Güvenliği Politikamız",
        icon: <ShieldCheck className={ICON} />,
        body: (
            <>
                <p>
                    Derneğimiz, kişisel verilerinizin hukuka aykırı erişime, kayba ve kötüye kullanıma
                    karşı korunması için gerekli teknik ve idari tedbirleri alır.
                </p>
                <ul>
                    <li>Yönetim paneline yalnızca yetkili kişiler şifreyle erişebilir.</li>
                    <li>Veriler güvenli sunucularda saklanır ve düzenli olarak yedeklenir.</li>
                    <li>Veriler, amaçların gerektirdiği süreyle sınırlı tutulur; süre sonunda silinir veya anonimleştirilir.</li>
                    <li>Verileriniz, açık rızanız olmaksızın pazarlama amacıyla üçüncü kişilerle paylaşılmaz.</li>
                </ul>
            </>
        ),
    },
    {
        id: "cerez",
        title: "Çerez (Cookie) Politikası",
        icon: <Cookie className={ICON} />,
        body: (
            <>
                <p>
                    Web sitemiz; temel işlevlerin çalışması ve ziyaret istatistiklerinin tutulması için
                    sınırlı çerezler kullanabilir.
                </p>
                <ul>
                    <li><strong>Zorunlu çerezler:</strong> sitenin düzgün çalışması için gereklidir.</li>
                    <li><strong>İstatistik çerezleri:</strong> ziyaret sayılarını anonim olarak ölçmek için kullanılabilir.</li>
                </ul>
                <p>
                    Tarayıcı ayarlarınızdan çerezleri reddedebilir veya silebilirsiniz; ancak bu durumda
                    bazı özellikler düzgün çalışmayabilir.
                </p>
            </>
        ),
    },
    {
        id: "haklar",
        title: "İlgili Kişi Olarak Haklarınız (KVKK m.11)",
        icon: <UserCheck className={ICON} />,
        body: (
            <>
                <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul>
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                    <li>İşlenmişse buna ilişkin bilgi talep etme ve amacını öğrenme,</li>
                    <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                    <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
                    <li>İlgili mevzuata uygun olarak silinmesini/yok edilmesini isteme,</li>
                    <li>Otomatik analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme.</li>
                </ul>
            </>
        ),
    },
    {
        id: "basvuru",
        title: "İlgili Kişi Başvuru Formu",
        icon: <PenLine className={ICON} />,
        body: (
            <>
                <p>
                    Haklarınıza ilişkin taleplerinizi aşağıdaki kanallardan iletebilirsiniz. Başvurularınız
                    en geç 30 gün içinde sonuçlandırılır.
                </p>
                <ul>
                    <li><strong>E-posta:</strong> info@sinopmubadele.org.tr</li>
                    <li><strong>Adres:</strong> Kefevi, Kuruçeşme Sk. No:23/1, 57000 Sinop Merkez/Sinop</li>
                </ul>
                <p>
                    Ayrıca <a href="/iletisim" className="font-semibold text-red-900 underline underline-offset-2">iletişim sayfamız</a> üzerinden de bize ulaşabilirsiniz.
                </p>
            </>
        ),
    },
];

export default function KvkkAccordion() {
    return <AccordionCards items={ITEMS} />;
}
