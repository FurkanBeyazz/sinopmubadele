'use client';

import { Landmark, Target, UserPlus, UserMinus, Users, Wallet, Gavel } from "lucide-react";
import AccordionCards, { type AccordionItem } from "@/components/ui/accordion-cards";

const ICON = "h-5 w-5";

// NOT: Aşağıdaki madde içerikleri örnek/placeholder'dır.
// Derneğin resmî tüzük metnini buraya yapıştırarak güncelleyebilirsiniz.
const ITEMS: AccordionItem[] = [
    {
        id: "ad-merkez",
        title: "Madde 1 — Derneğin Adı ve Merkezi",
        icon: <Landmark className={ICON} />,
        body: (
            <p>
                Derneğin adı “Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları ve Dayanışma
                Derneği”dir. Derneğin merkezi Sinop’tur. (Resmî tüzük maddesi buraya eklenecektir.)
            </p>
        ),
    },
    {
        id: "amac",
        title: "Madde 2 — Derneğin Amacı",
        icon: <Target className={ICON} />,
        body: (
            <p>
                Mübadele ve Balkan halkları kültürünü araştırmak, belgelemek, yaşatmak ve üyeler
                arasında sosyal dayanışmayı güçlendirmek. (Resmî amaç maddesi buraya eklenecektir.)
            </p>
        ),
    },
    {
        id: "uyelik",
        title: "Madde 3 — Üyelik Şartları",
        icon: <UserPlus className={ICON} />,
        body: (
            <p>
                Fiil ehliyetine sahip, derneğin amaçlarını benimseyen herkes üye olabilir. Üyelik
                şartları ve başvuru usulü buraya eklenecektir.
            </p>
        ),
    },
    {
        id: "uyelikten-cikma",
        title: "Madde 4 — Üyelikten Çıkma ve Çıkarılma",
        icon: <UserMinus className={ICON} />,
        body: (
            <p>
                Üyelikten çıkma, çıkarılma ve itiraz süreçlerine ilişkin hükümler buraya eklenecektir.
            </p>
        ),
    },
    {
        id: "organlar",
        title: "Madde 5 — Derneğin Organları",
        icon: <Users className={ICON} />,
        body: (
            <p>
                Genel Kurul, Yönetim Kurulu ve Denetim Kurulu derneğin organlarıdır. Görev ve
                yetkilerine ilişkin maddeler buraya eklenecektir.
            </p>
        ),
    },
    {
        id: "gelir",
        title: "Madde 6 — Gelir Kaynakları",
        icon: <Wallet className={ICON} />,
        body: (
            <p>
                Üye aidatları, bağışlar, etkinlik gelirleri ve mevzuata uygun diğer gelirler. (Detaylı
                madde buraya eklenecektir.)
            </p>
        ),
    },
    {
        id: "hukumler",
        title: "Madde 7 — Çeşitli Hükümler",
        icon: <Gavel className={ICON} />,
        body: (
            <p>
                Tüzükte hüküm bulunmayan hâllerde 5253 sayılı Dernekler Kanunu ve ilgili mevzuat
                uygulanır. (Diğer hükümler buraya eklenecektir.)
            </p>
        ),
    },
];

export default function TuzukAccordion() {
    return <AccordionCards items={ITEMS} />;
}
