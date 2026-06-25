import { notFound } from "next/navigation";
import { getPageBySlug } from "@/actions/page-actions";
import KulturEviClient from "./kultur-evi-client";

export const dynamic = "force-dynamic";

export default async function KulturEviPage() {
    // Veritabanından veriyi çek
    const pageData = await getPageBySlug("kultur-evi");

    if (!pageData) {
        return notFound();
    }

    // pageData'yı client bileşenine gönder
    // null değerleri serialize edilebilir hale getirmek gerekebilir ama Next.js Server Components props'larında bu genellikle otomatik halledilir.
    // Ancak Page modelindeki Date objeleri sorun yaratabilir. getPageBySlug dönüş tipine dikkat.
    // Şimdilik direkt gönderiyorum.

    return <KulturEviClient pageData={pageData} />;
}
