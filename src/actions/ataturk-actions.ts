'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import {
    ATATURK_DEFAULTS,
    safeParseJSON,
    type AtaturkData,
    type GalleryItem,
    type SongItem,
} from "@/lib/ataturk";

export async function getAtaturkData(): Promise<AtaturkData> {
    try {
        const row = await prisma.ataturkSetting.findUnique({ where: { id: "singleton" } });
        if (!row) return ATATURK_DEFAULTS;
        return {
            heroImage: row.heroImage || ATATURK_DEFAULTS.heroImage,
            gallery: safeParseJSON<GalleryItem[]>(row.gallery, ATATURK_DEFAULTS.gallery),
            songs: safeParseJSON<SongItem[]>(row.songs, ATATURK_DEFAULTS.songs),
        };
    } catch (error) {
        console.error("Atatürk Köşesi verisi getirme hatası:", error);
        return ATATURK_DEFAULTS;
    }
}

export async function updateAtaturkData(data: AtaturkData) {
    try {
        await requireAdmin();
        await prisma.ataturkSetting.upsert({
            where: { id: "singleton" },
            update: {
                heroImage: data.heroImage,
                gallery: JSON.stringify(data.gallery),
                songs: JSON.stringify(data.songs),
            },
            create: {
                id: "singleton",
                heroImage: data.heroImage,
                gallery: JSON.stringify(data.gallery),
                songs: JSON.stringify(data.songs),
            },
        });
        revalidatePath("/ataturk-kosesi");
        revalidatePath("/admin/ataturk");
        return { success: true };
    } catch (error) {
        console.error("Atatürk Köşesi güncelleme hatası:", error);
        return { success: false, error: "Kaydedilemedi. Lütfen tekrar deneyin." };
    }
}
