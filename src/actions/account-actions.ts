'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Yetkisiz işlem. Lütfen giriş yapın." };
        }
        if (!currentPassword || !newPassword) {
            return { success: false, error: "Tüm alanları doldurun." };
        }
        if (newPassword.length < 8) {
            return { success: false, error: "Yeni şifre en az 8 karakter olmalıdır." };
        }

        const userId = (session.user as any).id as string | undefined;
        const email = session.user.email || undefined;

        const user = await prisma.user.findFirst({
            where: userId ? { id: userId } : { email },
        });
        if (!user) {
            return { success: false, error: "Kullanıcı bulunamadı." };
        }

        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) {
            return { success: false, error: "Mevcut şifreniz hatalı." };
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
        });

        return { success: true };
    } catch (error) {
        console.error("Şifre değiştirme hatası:", error);
        return { success: false, error: "Şifre değiştirilemedi. Lütfen tekrar deneyin." };
    }
}
