import { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import PolicyHeader from "@/components/policy-header";
import SssAccordion from "./_components/sss-accordion";

export const metadata: Metadata = {
    title: "Sıkça Sorulan Sorular",
    description: "Sinop Mübadele ve Balkan Halkları Derneği hakkında sıkça sorulan sorular ve yanıtları.",
};

export default function SssPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <PolicyHeader
                title="Sıkça Sorulan Sorular"
                subtitle="Derneğimiz ve faaliyetlerimiz hakkında merak edilenler."
                icon={<HelpCircle className="h-8 w-8" />}
            />
            <div className="container mx-auto px-4 py-16">
                <SssAccordion />
            </div>
        </div>
    );
}
