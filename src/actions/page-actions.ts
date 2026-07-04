"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";

// Yeni sayfa oluşturur (başlıktan/slug'dan benzersiz URL üretir)
export async function createPage(data: { title: string; slug?: string; content?: string; heroImage?: string }) {
    try {
        await requireAdmin();
        const slug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.title);

        const existing = await prisma.page.findUnique({ where: { slug } });
        if (existing) {
            return { success: false, error: "Bu URL (slug) zaten kullanımda." };
        }

        const page = await prisma.page.create({
            data: {
                slug,
                title: data.title,
                content: data.content || "",
                heroImage: data.heroImage || null,
                images: "[]",
            },
        });

        revalidatePath("/admin/pages");
        revalidatePath(`/${slug}`);
        return { success: true, data: page };
    } catch (error: any) {
        console.error("Sayfa oluşturma hatası:", error?.message || error);
        return { success: false, error: "Sayfa oluşturulamadı." };
    }
}

export async function getPageBySlug(slug: string) {
    console.log(`[getPageBySlug] Fetching page with slug: ${slug}`);
    try {
        const page = await prisma.page.findUnique({
            where: {
                slug,
            },
        });
        console.log(`[getPageBySlug] Result for ${slug}:`, page ? "Found" : "Not Found");
        return page;
    } catch (error) {
        console.error("Sayfa getirilirken hata:", error);
        return null; // Return null if not found or error
    }
}

export async function updatePage(slug: string, data: { title: string; content: string; images?: string | string[] | any; panoramaImage?: string | null; heroImage?: string | null }) {
    console.log(`[updatePage] Updating page ${slug} with title: ${data.title}`);

    try {
        await requireAdmin();
        // 1. Gelen resim verisini GARANTİ olarak String (JSON) formatına çevir
        let safeImages = "[]";

        if (typeof data.images === "string") {
            // Zaten string ise (muhtemelen JSON), olduğu gibi kullan
            safeImages = data.images;
        } else if (Array.isArray(data.images)) {
            // Array ise stringify yap
            safeImages = JSON.stringify(data.images);
        } else if (data.images) {
            // Başka bir türse (object vs) array içine alıp stringify yap
            safeImages = JSON.stringify([data.images]);
        }

        console.log(`[updatePage] Safe images payload: ${safeImages.substring(0, 50)}...`);

        // 2. Prisma Upsert İşlemi
        const upsertData: any = {
            title: data.title,
            content: data.content,
            images: safeImages,
            panoramaImage: data.panoramaImage
        };
        // heroImage yalnızca gönderildiyse güncelle
        if (data.heroImage !== undefined) {
            upsertData.heroImage = data.heroImage;
        }

        const page = await prisma.page.upsert({
            where: { slug },
            update: upsertData,
            create: {
                slug,
                ...upsertData
            }
        });

        // 3. Önbelleği (Cache) Temizle
        revalidatePath(`/admin/pages/${slug}`);
        revalidatePath(`/${slug}`);
        revalidatePath(`/admin/pages`);

        console.log(`[updatePage] Success for ${slug}`);
        return { success: true, message: "Sayfa başarıyla güncellendi.", data: page };
    } catch (error: any) {
        // HATA AYIKLAMA İÇİN TERMİNALE YAZDIR:
        console.error("🔴 SAYFA KAYDETME HATASI (updatePage):", error.message || error);
        return { success: false, message: "Kaydetme başarısız oldu: " + (error.message || "Bilinmeyen hata") };
    }
}
