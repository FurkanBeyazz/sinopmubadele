import { Metadata } from "next";
import { FileText } from "lucide-react";
import PolicyHeader from "@/components/policy-header";
import TuzukAccordion from "./_components/tuzuk-accordion";

export const metadata: Metadata = {
    title: "Dernek Tüzüğü",
    description: "Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları ve Dayanışma Derneği tüzüğü.",
};

export default function TuzukPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <PolicyHeader
                title="Dernek Tüzüğü"
                subtitle="Derneğimizin amaç, üyelik ve işleyişini düzenleyen tüzük maddeleri."
                icon={<FileText className="h-8 w-8" />}
            />
            <div className="container mx-auto px-4 py-16">
                <TuzukAccordion />
            </div>
        </div>
    );
}
