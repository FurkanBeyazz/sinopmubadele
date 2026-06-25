import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import PolicyHeader from "@/components/policy-header";
import KvkkAccordion from "./_components/kvkk-accordion";

export const metadata: Metadata = {
    title: "KVKK ve Gizlilik Politikası",
    description:
        "Sinop Mübadele ve Balkan Halkları Derneği kişisel verilerin korunması (KVKK), bilgi güvenliği ve çerez politikası bilgilendirmesi.",
};

export default function GizlilikPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <PolicyHeader
                title="KVKK ve Bilgi Güvenliği"
                subtitle="Derneğimiz olarak kişisel verilerinizin güvenliğine ve gizliliğine en üst düzeyde önem veriyoruz."
                icon={<ShieldCheck className="h-8 w-8" />}
            />
            <div className="container mx-auto px-4 py-16">
                <KvkkAccordion />
            </div>
        </div>
    );
}
