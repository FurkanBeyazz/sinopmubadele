import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Yönetici (admin) yetkisi gerektiren sunucu işlemleri için koruma.
 * Oturum yoksa hata fırlatır; çağıran fonksiyonun try/catch'i bunu yakalayıp
 * { success: false } döndürür. Böylece yetkisiz istekler engellenir.
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Yetkisiz işlem. Bu işlem için giriş yapmalısınız.");
    }
    return session;
}
