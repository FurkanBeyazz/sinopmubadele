import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// --- Giriş denemesi sınırlayıcı (kaba kuvvet koruması) ---
// 5 hatalı denemeden sonra o e-posta 15 dakika kilitlenir.
// Bellek-içi tutulur; tek PM2 instance'ı için yeterlidir.
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkLock(key: string) {
    const entry = loginAttempts.get(key);
    if (entry && entry.lockedUntil > Date.now()) {
        const kalanDk = Math.ceil((entry.lockedUntil - Date.now()) / 60000);
        throw new Error(`Çok fazla hatalı deneme. ${kalanDk} dakika sonra tekrar deneyin.`);
    }
}

function recordFail(key: string) {
    const entry = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
    entry.count += 1;
    if (entry.count >= MAX_ATTEMPTS) {
        entry.lockedUntil = Date.now() + LOCK_MS;
        entry.count = 0;
    }
    loginAttempts.set(key, entry);
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("E-posta ve şifre gereklidir.");
                }

                const key = credentials.email.trim().toLowerCase();
                checkLock(key);

                // Find user in database
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                // Tek tip hata mesajı: e-postanın kayıtlı olup olmadığı sızmasın
                if (!user) {
                    recordFail(key);
                    throw new Error("E-posta veya şifre hatalı.");
                }

                // Compare password with bcrypt hash
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    recordFail(key);
                    throw new Error("E-posta veya şifre hatalı.");
                }

                // Başarılı giriş: deneme sayacını sıfırla
                loginAttempts.delete(key);

                // Return user object (this gets encoded in the JWT)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
