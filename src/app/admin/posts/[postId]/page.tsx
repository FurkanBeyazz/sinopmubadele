import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostEditForm from './edit-form';

interface EditPostPageProps {
    params: { postId: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const post = await prisma.announcement.findUnique({
        where: { id: params.postId },
    });

    if (!post) {
        notFound();
    }

    return (
        <PostEditForm
            initialData={{
                id: post.id,
                title: post.title,
                content: post.content,
                featuredImage: post.featuredImage || '',
                category: post.category,
                published: post.published,
                images: post.images || undefined,
            }}
        />
    );
}
