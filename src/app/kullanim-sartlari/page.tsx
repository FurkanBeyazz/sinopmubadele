import { Metadata } from "next";
import { ScrollText } from "lucide-react";
import PolicyHeader from "@/components/policy-header";
import TermsAccordion from "./_components/terms-accordion";

export const metadata: Metadata = {
    title: "Kullanım Şartları",
    description: "Sinop Mübadele ve Balkan Halkları Derneği web sitesi kullanım şartları.",
};

export default function KullanimSartlariPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <PolicyHeader
                title="Kullanım Şartları"
                subtitle="Web sitemizi kullanırken geçerli olan koşullar ve kurallar."
                icon={<ScrollText className="h-8 w-8" />}
            />
            <div className="container mx-auto px-4 py-16">
                <TermsAccordion />
            </div>
        </div>
    );
}
