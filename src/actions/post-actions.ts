'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export async function getPosts() {
    const posts = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return posts;
}

export async function getPost(id: string) {
    const post = await prisma.announcement.findUnique({
        where: { id },
    });
    return post;
}

export async function createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    images?: string[]; // Array of strings
    category: string;
    author?: string;
    published: boolean;
}) {
    await requireAdmin();
    const post = await prisma.announcement.create({
        data: {
            title: data.title,
            content: data.content,
            excerpt: data.excerpt || '',
            featuredImage: data.featuredImage || '',
            images: data.images ? JSON.stringify(data.images) : '[]',
            category: data.category,
            author: data.author || 'Kenan Başkan',
            published: data.published,
            date: new Date(),
        },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/');
    revalidatePath('/haberler');
    revalidatePath('/etkinlikler');
    return post;
}

export async function updatePost(
    id: string,
    data: {
        title: string;
        content: string;
        excerpt?: string;
        featuredImage?: string;
        images?: string[];
        category: string;
        author?: string;
        published: boolean;
    }
) {
    await requireAdmin();
    const post = await prisma.announcement.update({
        where: { id },
        data: {
            title: data.title,
            content: data.content,
            excerpt: data.excerpt || '',
            featuredImage: data.featuredImage || '',
            images: data.images ? JSON.stringify(data.images) : undefined, // Only update if provided
            category: data.category,
            author: data.author || 'Kenan Başkan',
            published: data.published,
        },
    });

    revalidatePath('/admin/posts');
    revalidatePath(`/admin/posts/${id}`);
    revalidatePath('/');
    revalidatePath('/haberler');
    revalidatePath('/etkinlikler');
    revalidatePath(`/haberler/${id}`);
    return post;
}

export async function deletePost(id: string) {
    await requireAdmin();
    await prisma.announcement.delete({
        where: { id },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/');
    revalidatePath('/haberler');
    revalidatePath('/etkinlikler');
}
