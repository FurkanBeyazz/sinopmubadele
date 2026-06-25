'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/actions/post-actions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`"${postTitle}" başlıklı haberi silmek istediğinize emin misiniz?`)) return;

        await deletePost(postId);
        router.refresh();
    };

    return (
        <DropdownMenuItem
            onClick={handleDelete}
            className="rounded-lg h-9 px-3 font-bold text-sm text-red-600 hover:bg-red-50 cursor-pointer"
        >
            <Trash2 size={14} className="mr-2" /> Sil
        </DropdownMenuItem>
    );
}
