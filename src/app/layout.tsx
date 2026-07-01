import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HideOnAdmin from "@/components/hide-on-admin";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";
import Analytics from "@/components/analytics";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: '--font-playfair',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Sinop Mübadele ve Balkan Halkları Derneği",
        template: "%s | Sinop Mübadele ve Balkan Halkları Derneği",
    },
    description: "Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları Derneği olarak köklerimizi unutmuyor, kültürümüzü yarınlara taşıyoruz. Mübadele ve Balkan kültürü üzerine araştırmalar ve etkinlikler.",
    keywords: ["Sinop", "Mübadele", "Balkan", "Dernek", "Kültür", "Tarih", "Araştırma", "Halkları"],
    authors: [{ name: "Kenan Başkan" }],
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: SITE_URL,
        siteName: "Sinop Mübadele Derneği",
        // Görsel: app/opengraph-image.tsx otomatik olarak eklenir.
    },
    twitter: {
        card: "summary_large_image",
        title: "Sinop Mübadele ve Balkan Halkları Derneği",
        description: "Geçmişin İzleri, Geleceğin Sesi.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className="scroll-smooth">
            <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#fdfbf7] antialiased flex flex-col min-h-screen`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <HideOnAdmin>
                        <Navbar />
                    </HideOnAdmin>
                    <main className="flex-grow">
                        {children}
                    </main>
                    <HideOnAdmin>
                        <Footer />
                    </HideOnAdmin>
                    <Toaster />
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
