'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-guard";

const contactSchema = z.object({
    name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır").max(120),
    email: z.string().email("Geçerli bir e-posta adresi giriniz").max(160),
    phone: z.string()
        .min(7, "Geçerli bir telefon numarası giriniz")
        .max(20, "Telefon numarası çok uzun")
        .regex(/^[0-9+()\s-]+$/, "Telefon yalnızca rakam ve + ( ) - içerebilir"),
    subject: z.string().min(3, "Konu en az 3 karakter olmalıdır").max(200),
    message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır").max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Basit, bellek-içi hız sınırı (tek sunucu için yeterli):
// Aynı IP'den 10 dakikada en fazla 3 mesaj.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
    if (hits.length >= RATE_LIMIT) {
        ipHits.set(ip, hits);
        return true;
    }
    hits.push(now);
    ipHits.set(ip, hits);
    return false;
}

// honeypot: gizli alan; botlar doldurur, gerçek kullanıcı boş bırakır.
export async function submitMessage(data: ContactFormData, honeypot?: string) {
    try {
        // 1) Honeypot dolu => bot. Sessizce "başarılı" dön (kaydetme).
        if (honeypot && honeypot.trim() !== "") {
            return { success: true };
        }

        // 2) Hız sınırı (IP bazlı)
        const ip =
            headers().get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headers().get("x-real-ip") ||
            "unknown";
        if (isRateLimited(ip)) {
            return { success: false, error: "Çok fazla mesaj gönderdiniz. Lütfen biraz sonra tekrar deneyin." };
        }

        const validatedData = contactSchema.parse(data);

        const message = await prisma.contactMessage.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                subject: validatedData.subject,
                message: validatedData.message,
            },
        });

        revalidatePath('/admin/messages');
        return { success: true, message };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Mesaj gönderme hatası:", error);
        return { success: false, error: "Mesaj gönderilirken bir hata oluştu." };
    }
}

export async function getMessages() {
    try {
        await requireAdmin();
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return messages;
    } catch (error) {
        console.error("Mesajları getirme hatası:", error);
        return [];
    }
}

export async function markAsRead(id: string) {
    try {
        await requireAdmin();
        await prisma.contactMessage.update({
            where: { id },
            data: { isRead: true },
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error("Mesaj okundu işaretleme hatası:", error);
        return { success: false, error: "İşlem başarısız oldu." };
    }
}

export async function deleteMessage(id: string) {
    try {
        await requireAdmin();
        await prisma.contactMessage.delete({
            where: { id },
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error("Mesaj silme hatası:", error);
        return { success: false, error: "Mesaj silinemedi." };
    }
}

