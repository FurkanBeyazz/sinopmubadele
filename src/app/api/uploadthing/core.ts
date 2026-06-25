import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

// Sadece giriş yapmış admin dosya yükleyebilir
async function ensureAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new UploadThingError("Yetkisiz: dosya yüklemek için giriş yapmalısınız.");
    }
    return { userId: (session.user as any).id || "admin" };
}

export const ourFileRouter = {
    // 1. TEKLİ YÜKLEME (Profil, Kapak Görseli vb.)
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            return await ensureAdmin();
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("✅ Tekli dosya yüklendi:", file.url);
            return { url: file.url };
        }),

    // 2. ÇOKLU YÜKLEME (Anı Köşesi, Galeri)
    bulkImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
        .middleware(async () => {
            return await ensureAdmin();
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("✅ Çoklu dosya parça yüklendi:", file.url);
            return { url: file.url };
        }),

    // 3. Sayfa galerileri için çoklu resim yükleyici (Maksimum 10 dosya)
    pageImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(async () => {
            return await ensureAdmin();
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete:", file.url);
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
