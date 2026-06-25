'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth-guard";

export type GalleryFormData = {
    title: string;
    description?: string;
    coverImage?: string;
};

export async function createGallery(data: GalleryFormData) {
    try {
        await requireAdmin();
        const slug = slugify(data.title);

        const existing = await prisma.gallery.findUnique({
            where: { slug }
        });

        if (existing) {
            return { success: false, error: "Bu albüm ismi zaten kullanımda." };
        }

        const gallery = await prisma.gallery.create({
            data: {
                title: data.title,
                description: data.description,
                coverImage: data.coverImage,
                slug,
            },
        });

        revalidatePath('/admin/gallery');
        revalidatePath('/galeri');
        return { success: true, gallery };
    } catch (error) {
        console.error("Albüm oluşturma hatası:", error);
        return { success: false, error: "Albüm oluşturulurken bir hata oluştu." };
    }
}

export async function updateGallery(id: string, data: GalleryFormData) {
    try {
        await requireAdmin();
        const slug = slugify(data.title);

        // Check if slug exists in other galleries
        const existing = await prisma.gallery.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        });

        if (existing) {
            return { success: false, error: "Bu albüm ismi zaten başka bir albümde kullanımda." };
        }

        const gallery = await prisma.gallery.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                coverImage: data.coverImage,
                slug,
            },
        });

        revalidatePath('/admin/gallery');
        revalidatePath(`/admin/gallery/${id}`);
        revalidatePath('/galeri');
        revalidatePath(`/galeri/${slug}`);

        return { success: true, gallery };
    } catch (error) {
        console.error("Albüm güncelleme hatası:", error);
        return { success: false, error: "Albüm güncellenirken bir hata oluştu." };
    }
}

export async function addImagesToGallery(galleryId: string, urls: string[]) {
    try {
        await requireAdmin();
        const images = await prisma.galleryImage.createMany({
            data: urls.map(url => ({
                url,
                galleryId,
            })),
        });

        revalidatePath(`/admin/gallery/${galleryId}`);
        revalidatePath(`/galeri/${galleryId}`);

        // Also revalidate the slug path if we have it
        const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
        if (gallery) {
            revalidatePath(`/galeri/${gallery.slug}`);
        }

        return { success: true, count: images.count };
    } catch (error) {
        console.error("Resim ekleme hatası:", error);
        return { success: false, error: "Resimler eklenirken bir hata oluştu." };
    }
}

export async function deleteGallery(id: string) {
    try {
        await requireAdmin();
        await prisma.gallery.delete({
            where: { id },
        });

        revalidatePath('/admin/gallery');
        revalidatePath('/galeri');
        return { success: true };
    } catch (error) {
        console.error("Albüm silme hatası:", error);
        return { success: false, error: "Albüm silinirken bir hata oluştu." };
    }
}

export async function deleteImage(id: string, galleryId: string) {
    try {
        await requireAdmin();
        await prisma.galleryImage.delete({
            where: { id },
        });

        revalidatePath(`/admin/gallery/${galleryId}`);
        return { success: true };
    } catch (error) {
        console.error("Resim silme hatası:", error);
        return { success: false, error: "Resim silinirken bir hata oluştu." };
    }
}

export async function getGalleries() {
    try {
        const galleries = await prisma.gallery.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { images: true }
                }
            }
        });
        return galleries;
    } catch (error) {
        return [];
    }
}

export async function getGalleryBySlug(slug: string) {
    try {
        const gallery = await prisma.gallery.findUnique({
            where: { slug },
            include: {
                images: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return gallery;
    } catch (error) {
        return null;
    }
}

export async function getGalleryById(id: string) {
    try {
        const gallery = await prisma.gallery.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return gallery;
    } catch (error) {
        return null;
    }
}
