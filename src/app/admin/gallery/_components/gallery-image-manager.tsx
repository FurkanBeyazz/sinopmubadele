"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/utils/uploadthing";
import { addImagesToGallery, deleteImage } from "@/actions/gallery-actions";
import { toast } from "sonner";
import { Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface GalleryImageManagerProps {
    galleryId: string;
    initialImages: {
        id: string;
        url: string;
    }[];
}

export default function GalleryImageManager({ galleryId, initialImages }: GalleryImageManagerProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (imageId: string) => {
        setIsDeleting(imageId);
        try {
            const result = await deleteImage(imageId, galleryId);
            if (result.success) {
                toast.success("Fotoğraf silindi.");
                router.refresh();
            } else {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error("Silme işlemi başarısız oldu.");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 bg-slate-50 dark:bg-slate-800/30 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-red-900/40 group">
                <div className="flex flex-col items-center">
                    <div className="mb-6 p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        <ImageIcon className="h-10 w-10 text-slate-400 group-hover:text-red-900" />
                    </div>
                    <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={async (res) => {
                            if (res && res.length > 0) {
                                const urls = res.map(file => file.url);
                                const result = await addImagesToGallery(galleryId, urls);
                                if (result.success) {
                                    toast.success(`${res.length} adet fotoğraf eklendi.`);
                                    router.refresh();
                                } else {
                                    toast.error(result.error as string);
                                }
                            }
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`Yükleme hatası: ${error.message}`);
                        }}
                        appearance={{
                            label: "text-slate-600 dark:text-slate-400 font-bold text-lg mb-4",
                            button: "bg-red-900 hover:bg-red-800 px-12 py-4 h-auto text-base font-bold shadow-xl shadow-red-900/20 transition-all active:scale-[0.98]",
                            container: "bg-transparent border-none p-0",
                            allowedContent: "text-slate-400 text-[11px] mt-6 font-medium"
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" /> Albümdeki Fotoğraflar
                </h3>

                {initialImages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed text-muted-foreground">
                        Henüz fotoğraf yüklenmemiş.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {initialImages.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group border bg-white">
                                <Image
                                    src={img.url}
                                    alt="Galeri Görseli"
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(img.id)}
                                        disabled={isDeleting === img.id}
                                    >
                                        {isDeleting === img.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
