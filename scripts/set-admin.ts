/**
 * Admin kullanıcı oluştur/güncelle (upsert).
 * Kullanım:
 *   ADMIN_EMAIL='admin@sinopmubadele.com' ADMIN_PASSWORD='YeniSifre123!' npx tsx scripts/set-admin.ts
 * E-posta varsa şifresini günceller, yoksa yeni kullanıcı oluşturur.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('❌ ADMIN_EMAIL ve ADMIN_PASSWORD ortam değişkenleri gerekli.');
        process.exit(1);
    }
    if (password.length < 8) {
        console.error('❌ Şifre en az 8 karakter olmalı.');
        process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashed, role: 'ADMIN' },
        create: { email, password: hashed, name: 'Yönetici', role: 'ADMIN' },
    });

    console.log(`✅ Admin hazır: ${user.email}`);
}

main()
    .catch((e) => {
        console.error('❌ Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
