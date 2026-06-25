import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewsDetailClient from "@/components/news-detail-client";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    try {
        const post = await prisma.announcement.findUnique({ where: { id: params.id } });

        if (!post) {
            return notFound();
        }

        const galleryImages = post?.images && typeof post.images === 'string'
            ? JSON.parse(post.images)
            : Array.isArray(post?.images) ? post.images : [];

        const clientPost = {
            id: post.id,
            title: post.title,
            content: post.content,
            summary: post.excerpt,
            image: post.featuredImage,
            date: post.date,
            author: post.author,
            category: post.category,
            views: post.views || 0,
            images: galleryImages,
        };

        return <NewsDetailClient post={clientPost} />;
    } catch (error) {
        console.error(error);
        return <div>Hata oluştu. Lütfen daha sonra tekrar deneyiniz.</div>;
    }
}
