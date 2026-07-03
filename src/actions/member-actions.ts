'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { memberSchema, MemberFormData } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth-guard";

export async function createMember(data: MemberFormData) {
    try {
        await requireAdmin();
        const validatedData = memberSchema.parse(data);
        const member = await prisma.boardMember.create({
            data: {
                name: validatedData.name,
                role: validatedData.role,
                image: validatedData.image,
                bio: validatedData.bio,
                order: validatedData.order,
                type: validatedData.type,
                status: validatedData.status,
                parentId: validatedData.parentId || null,
            },
        });
        revalidatePath('/admin/members');
        revalidatePath('/yonetim');
        return { success: true, member };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Üye oluşturma hatası:", error);
        return { success: false, error: "Üye oluşturulurken bir hata oluştu." };
    }
}

export async function updateMember(id: string, data: MemberFormData) {
    try {
        await requireAdmin();
        const validatedData = memberSchema.parse(data);
        // Kendini ya da bir altını üst olarak seçmeyi engelle (döngü koruması)
        const safeParentId = validatedData.parentId && validatedData.parentId !== id
            ? validatedData.parentId
            : null;
        const member = await prisma.boardMember.update({
            where: { id },
            data: {
                name: validatedData.name,
                role: validatedData.role,
                image: validatedData.image,
                bio: validatedData.bio,
                order: validatedData.order,
                type: validatedData.type,
                status: validatedData.status,
                parentId: safeParentId,
            },
        });
        revalidatePath('/admin/members');
        revalidatePath('/yonetim');
        return { success: true, member };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Üye güncelleme hatası:", error);
        return { success: false, error: "Üye güncellenirken bir hata oluştu." };
    }
}

export async function deleteMember(id: string) {
    try {
        await requireAdmin();
        // Silinen üyenin altındaki birimleri köksüz bırakmadan üst seviyeye taşı
        const node = await prisma.boardMember.findUnique({ where: { id } });
        await prisma.boardMember.updateMany({
            where: { parentId: id },
            data: { parentId: node?.parentId ?? null },
        });
        await prisma.boardMember.delete({
            where: { id },
        });
        revalidatePath('/admin/members');
        revalidatePath('/yonetim');
        return { success: true };
    } catch (error) {
        console.error("Üye silme hatası:", error);
        return { success: false, error: "Üye silinemedi." };
    }
}

export async function getMembers() {
    try {
        const members = await prisma.boardMember.findMany({
            orderBy: { order: 'asc' },
        });
        return members;
    } catch (error) {
        console.error("Üyeleri getirme hatası:", error);
        return [];
    }
}

// Toplu sıra güncelleme (admin'de yukarı/aşağı taşıma için)
export async function updateMembersOrder(items: { id: string; order: number }[]) {
    try {
        await requireAdmin();
        await prisma.$transaction(
            items.map((i) =>
                prisma.boardMember.update({ where: { id: i.id }, data: { order: i.order } })
            )
        );
        revalidatePath('/yonetim');
        revalidatePath('/admin/members');
        return { success: true };
    } catch (error) {
        console.error("Sıra güncelleme hatası:", error);
        return { success: false, error: "Sıra güncellenemedi." };
    }
}
