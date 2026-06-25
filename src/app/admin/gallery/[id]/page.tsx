import { getGalleryById } from "@/actions/gallery-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, Settings } from "lucide-react";
import Link from "next/link";
import GalleryImageManager from "../_components/gallery-image-manager";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import GalleryForm from "../_components/gallery-form";

interface GalleryDetailPageProps {
    params: {
        id: string;
    };
}

export default async function AdminGalleryDetailPage({ params }: GalleryDetailPageProps) {
    const gallery = await getGalleryById(params.id);

    if (!gallery) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Button variant="ghost" asChild className="w-fit">
                    <Link href="/admin/gallery">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Albümlere Dön
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">{gallery.title}</h1>
                            <Badge variant="secondary" className="bg-red-50 text-red-900 border-red-200">
                                {gallery.images.length} Fotoğraf
                            </Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">
                            {gallery.description || "Açıklama belirtilmemiş."}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="border-slate-300">
                                    <Settings className="mr-2 h-4 w-4" /> Bilgileri Düzenle
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-0 overflow-y-auto">
                                <div className="p-8">
                                    <SheetHeader className="mb-8">
                                        <SheetTitle className="text-2xl font-bold">Albüm Bilgilerini Güncelle</SheetTitle>
                                        <SheetDescription className="text-slate-500 dark:text-slate-400">
                                            Albüm başlığı, açıklaması ve kapak görselini buradan değiştirebilirsiniz.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="bg-white dark:bg-slate-900 rounded-xl">
                                        <GalleryForm initialData={gallery} />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 text-sm">
                            <Info className="h-4 w-4 shrink-0" />
                            <p>Aşağıdaki alana fotoğrafları sürükleyip bırakarak toplu yükleme yapabilirsiniz.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-200" />

            <GalleryImageManager
                galleryId={gallery.id}
                initialImages={gallery.images}
            />
        </div>
    );
}
