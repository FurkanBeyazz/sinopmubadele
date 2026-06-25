'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Undo, Redo, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            'p-2 rounded-lg transition-all hover:bg-slate-100',
            isActive && 'bg-slate-200 text-primary-red'
        )}
    >
        {children}
    </button>
);

export default function TiptapEditor({ content, onChange, placeholder = 'İçeriğinizi yazmaya başlayın...' }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-sm max-w-none focus:outline-none min-h-[300px] px-6 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return (
            <div className="border border-slate-200 rounded-xl bg-white animate-pulse h-[400px]" />
        );
    }

    return (
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex-wrap">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Başlık"
                >
                    <Heading2 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Kalın"
                >
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="İtalik"
                >
                    <Italic size={16} />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Madde Listesi"
                >
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numaralı Liste"
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Ayırıcı Çizgi"
                >
                    <Minus size={16} />
                </ToolbarButton>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Geri Al"
                >
                    <Undo size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Yinele"
                >
                    <Redo size={16} />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
