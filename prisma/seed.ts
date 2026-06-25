import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding başlatılıyor...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@sinopmubadele.org' },
    });

    if (existingAdmin) {
        console.log('⚠️  Admin kullanıcı zaten mevcut. Seed atlandı.');
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: 'admin@sinopmubadele.org',
            password: hashedPassword,
            name: 'Kenan Başkan',
            role: 'ADMIN',
        },
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
