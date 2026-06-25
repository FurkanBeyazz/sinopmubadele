'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

export type HeroSlideData = {
    title?: string;
    subtitle?: string;
    image: string;
    order?: number;
    isActive?: boolean;
};

export async function getSlides() {
    try {
        const slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' },
        });
        return slides;
    } catch (error) {
        console.error("Slaytlar getirilirken hata:", error);
        return [];
    }
}

export async function getActiveSlides() {
    try {
        const slides = await prisma.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
        return slides;
    } catch (error) {
        console.error("Aktif slaytlar getirilirken hata:", error);
        return [];
    }
}

export async function createSlide(data: HeroSlideData) {
    try {
        await requireAdmin();
        const count = await prisma.heroSlide.count();
        const slide = await prisma.heroSlide.create({
            data: {
                ...data,
                order: count, // Default to end of list
            },
        });

        revalidatePath('/admin/hero');
        revalidatePath('/');
        return { success: true, slide };
    } catch (error) {
        console.error("Slayt oluşturma hatası:", error);
        return { success: false, error: "Slayt oluşturulurken bir hata oluştu." };
    }
}

export async function deleteSlide(id: string) {
    try {
        await requireAdmin();
        await prisma.heroSlide.delete({
            where: { id },
        });

        revalidatePath('/admin/hero');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Slayt silme hatası:", error);
        return { success: false, error: "Slayt silinirken bir hata oluştu." };
    }
}

export async function toggleSlideStatus(id: string, isActive: boolean) {
    try {
        await requireAdmin();
        await prisma.heroSlide.update({
            where: { id },
            data: { isActive },
        });

        revalidatePath('/admin/hero');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Durum güncelleme hatası:", error);
        return { success: false, error: "Durum güncellenemedi." };
    }
}

export async function updateSlideOrder(items: { id: string; order: number }[]) {
    try {
        await requireAdmin();
        for (const item of items) {
            await prisma.heroSlide.update({
                where: { id: item.id },
                data: { order: item.order },
            });
        }

        revalidatePath('/admin/hero');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Sıralama güncelleme hatası:", error);
        return { success: false, error: "Sıralama güncellenemedi." };
    }
}
