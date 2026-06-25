'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image'; // Import Image extension
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Undo, Redo, Minus, Quote, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadThing } from "@/utils/uploadthing"; // Import Uploadthing hook
import { toast } from "sonner";
import { forwardRef, useState, useCallback } from 'react';

interface EditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'content'> {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false,
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={cn(
            'p-2 rounded-lg transition-all duration-200 hover:bg-slate-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            isActive && 'bg-slate-900 text-white hover:bg-slate-800'
        )}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-6 bg-slate-200 mx-0.5" />;

const Editor = forwardRef<HTMLDivElement, EditorProps>(
    ({ content, onChange, placeholder = 'Haberin içeriğini yazmaya başlayın...', className, ...props }, ref) => {
        const [isUploading, setIsUploading] = useState(false);
        const { startUpload } = useUploadThing("imageUploader"); // Use single image uploader

        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    heading: {
                        levels: [2, 3],
                    },
                }),
                Placeholder.configure({ placeholder }),
                ImageExtension.configure({
                    inline: true,
                    allowBase64: true,
                }),
            ],
            content,
            immediatelyRender: false,
            editorProps: {
                attributes: {
                    class: 'prose prose-slate prose-sm sm:prose-base max-w-none focus:outline-none min-h-[320px] px-6 py-5',
                },
            },
            onUpdate: ({ editor }) => {
                onChange(editor.getHTML());
            },
        });

        const addImage = useCallback(() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) {
                    setIsUploading(true);
                    const toastId = toast.loading("Görsel yükleniyor...");
                    try {
                        const res = await startUpload([file]);
                        if (res && res[0]) {
                            const url = res[0].url;
                            editor?.chain().focus().setImage({ src: url }).run();
                            toast.success("Görsel eklendi", { id: toastId });
                        }
                    } catch (error) {
                        toast.error("Görsel yüklenirken hata oluştu", { id: toastId });
                        console.error(error);
                    } finally {
                        setIsUploading(false);
                    }
                }
            };
            input.click();
        }, [editor, startUpload]);

        if (!editor) {
            return (
                <div ref={ref} className={cn("border border-slate-200 rounded-xl bg-white animate-pulse h-[420px]", className)} {...props} />
            );
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition-shadow focus-within:shadow-md focus-within:border-slate-300",
                    className
                )}
                {...props}
            >
                {/* Toolbar */}
                <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white flex-wrap sticky top-0 z-10">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Büyük Başlık (H2)"
                    >
                        <Heading2 size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Küçük Başlık (H3)"
                    >
                        <Heading3 size={16} />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Kalın (Ctrl+B)"
                    >
                        <Bold size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="İtalik (Ctrl+I)"
                    >
                        <Italic size={16} />
                    </ToolbarButton>

                    <Divider />

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
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Alıntı"
                    >
                        <Quote size={16} />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={addImage}
                        title="Görsel Ekle"
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Ayırıcı Çizgi"
                    >
                        <Minus size={16} />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        title="Geri Al (Ctrl+Z)"
                    >
                        <Undo size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        title="Yinele (Ctrl+Y)"
                    >
                        <Redo size={16} />
                    </ToolbarButton>
                </div>

                {/* Editor */}
                <EditorContent editor={editor} className="min-h-[300px]" />
            </div>
        );
    }
);

Editor.displayName = 'Editor';

export default Editor;
