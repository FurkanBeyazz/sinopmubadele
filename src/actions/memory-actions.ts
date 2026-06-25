'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

export type MemoryData = {
    visitorName: string;
    image: string;
    note?: string;
};

export async function getMemories() {
    try {
        const memories = await prisma.memory.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return memories;
    } catch (error) {
        console.error("Anılar getirilirken hata:", error);
        return [];
    }
}

export async function createMemory(data: MemoryData) {
    try {
        const memory = await prisma.memory.create({
            data: {
                visitorName: data.visitorName,
                image: data.image,
                note: data.note,
            },
        });

        revalidatePath('/admin/memory');
        revalidatePath('/ani-kosesi');
        return { success: true, memory };
    } catch (error) {
        console.error("Anı oluşturma hatası:", error);
        return { success: false, error: "Anı oluşturulurken bir hata oluştu." };
    }
}

export async function deleteMemory(id: string) {
    try {
        await requireAdmin();
        await prisma.memory.delete({
            where: { id },
        });

        revalidatePath('/admin/memory');
        revalidatePath('/ani-kosesi');
        return { success: true };
    } catch (error) {
        console.error("Anı silme hatası:", error);
        return { success: false, error: "Anı silinirken bir hata oluştu." };
    }
}

export async function deleteBulkMemories(ids: string[]) {
    try {
        await requireAdmin();
        await prisma.memory.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        revalidatePath('/admin/memory');
        revalidatePath('/ani-kosesi');
        return { success: true };
    } catch (error) {
        console.error("Toplu silme hatası:", error);
        return { success: false, error: "Anılar silinirken bir hata oluştu." };
    }
}

export async function updateBulkMemories(ids: string[], data: { visitorName?: string, note?: string }) {
    try {
        await requireAdmin();
        const updateData: any = {};
        if (data.visitorName) updateData.visitorName = data.visitorName;
        if (data.note) updateData.note = data.note;

        if (Object.keys(updateData).length === 0) return { success: true };

        await prisma.memory.updateMany({
            where: {
                id: { in: ids }
            },
            data: updateData
        });

        revalidatePath('/admin/memory');
        revalidatePath('/ani-kosesi');
        return { success: true };
    } catch (error) {
        console.error("Toplu güncelleme hatası:", error);
        return { success: false, error: "Anılar güncellenirken bir hata oluştu." };
    }
}
