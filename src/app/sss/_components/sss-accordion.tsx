'use client';

import { HelpCircle, UserPlus, Heart, Calendar, Image as ImageIcon, BookOpen } from "lucide-react";
import AccordionCards, { type AccordionItem } from "@/components/ui/accordion-cards";

const ICON = "h-5 w-5";

const ITEMS: AccordionItem[] = [
    {
        id: "amac",
        title: "Derneğin amacı nedir?",
        icon: <BookOpen className={ICON} />,
        body: (
            <p>
                Mübadele ve Balkan halkları kültürünü araştırmak, sözlü tarihi belgelemek, kültürel
                mirası gelecek nesillere aktarmak ve üyeler arasında sosyal dayanışmayı güçlendirmektir.
            </p>
        ),
    },
    {
        id: "uyelik",
        title: "Derneğe nasıl üye olabilirim?",
        icon: <UserPlus className={ICON} />,
        body: (
            <p>
                Derneğin amaçlarını benimseyen herkes üye olabilir. Üyelik için{" "}
                <a href="/iletisim" className="font-semibold text-red-900 underline underline-offset-2">iletişim</a>{" "}
                sayfamızdan bize ulaşarak başvuru sürecini başlatabilirsiniz.
            </p>
        ),
    },
    {
        id: "bagis",
        title: "Bağış nasıl yapabilirim?",
        icon: <Heart className={ICON} />,
        body: (
            <p>
                <a href="/bagis" className="font-semibold text-red-900 underline underline-offset-2">Bağış</a>{" "}
                sayfamızdaki banka/IBAN bilgileri üzerinden katkıda bulunabilirsiniz. Bağış açıklamasına
                “Bağış” yazmanız kayıtlarımız için önemlidir.
            </p>
        ),
    },
    {
        id: "etkinlik",
        title: "Etkinliklerden nasıl haberdar olurum?",
        icon: <Calendar className={ICON} />,
        body: (
            <p>
                Güncel etkinlikleri{" "}
                <a href="/etkinlikler" className="font-semibold text-red-900 underline underline-offset-2">Etkinlikler</a>{" "}
                ve{" "}
                <a href="/haberler" className="font-semibold text-red-900 underline underline-offset-2">Haberler</a>{" "}
                sayfalarımızdan ve sosyal medya hesaplarımızdan takip edebilirsiniz.
            </p>
        ),
    },
    {
        id: "ani",
        title: "Anılarımı veya fotoğraflarımı paylaşabilir miyim?",
        icon: <ImageIcon className={ICON} />,
        body: (
            <p>
                Elbette. Mübadele ve aile hatıralarınızı{" "}
                <a href="/ani-kosesi" className="font-semibold text-red-900 underline underline-offset-2">Anı Köşesi</a>{" "}
                aracılığıyla bizimle paylaşabilir, ortak hafızamıza katkı sağlayabilirsiniz.
            </p>
        ),
    },
];

export default function SssAccordion() {
    return <AccordionCards items={ITEMS} />;
}
