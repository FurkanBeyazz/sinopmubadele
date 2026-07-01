import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Güvenli seed: sabit/zayıf şifre İÇERMEZ.
 * Admin oluşturmak için ortam değişkenleri gerekir:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx prisma/seed.ts
 * Zaten kullanıcı varsa hiçbir şey yapmaz.
 */
async function main() {
    console.log('🌱 Seeding başlatılıyor...');

    const userCount = await prisma.user.count();
    if (userCount > 0) {
        console.log('⚠️  Kullanıcı zaten mevcut. Seed atlandı.');
        return;
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 8) {
        console.log('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD (min 8 karakter) tanımlı değil. Admin oluşturulmadı.');
        console.log('    Oluşturmak için: ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/set-admin.ts');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
        data: { email, password: hashedPassword, name: 'Yönetici', role: 'ADMIN' },
    });
    console.log(`✅ Admin kullanıcı oluşturuldu: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error('❌ Seed hatası:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
