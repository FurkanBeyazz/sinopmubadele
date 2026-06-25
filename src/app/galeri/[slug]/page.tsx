import { getGalleryBySlug } from "@/actions/gallery-actions";
import { notFound } from "next/navigation";
import GalleryView from "../_components/gallery-view";
import { Metadata } from "next";

interface GalleryDetailPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
    const gallery = await getGalleryBySlug(params.slug);
    if (!gallery) return { title: "Albüm Bulunamadı" };

    return {
        title: `${gallery.title} | Sinop Mübadele`,
        description: gallery.description || "Albüm detayları ve fotoğraflar.",
    };
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
    const gallery = await getGalleryBySlug(params.slug);

    if (!gallery) {
        notFound();
    }

    return (
        <>
            <GalleryView
                title={gallery.title}
                description={gallery.description}
                images={gallery.images}
            />
        </>
    );
}
