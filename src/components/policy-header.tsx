import type { ReactNode } from "react";

// KVKK / Tüzük / Şartlar / SSS sayfaları için ortak başlık alanı (site paleti).
export default function PolicyHeader({
    title,
    subtitle,
    icon,
}: {
    title: string;
    subtitle: string;
    icon: ReactNode;
}) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-red-950 to-[#1E3A5F] py-20 text-center text-white md:py-24">
            <div className="container mx-auto px-4">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                    {icon}
                </div>
                <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
                <p className="mx-auto max-w-2xl text-white/80">{subtitle}</p>
            </div>
        </section>
    );
}
