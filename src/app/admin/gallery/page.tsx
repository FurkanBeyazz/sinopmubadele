import { getGalleries } from "@/actions/gallery-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Image as ImageIcon, ExternalLink, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import GalleryForm from "./_components/gallery-form";
import { deleteGallery } from "@/actions/gallery-actions";

export default async function AdminGalleryPage() {
    const galleries = await getGalleries();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fotoğraf Galerisi</h1>
                    <p className="text-muted-foreground">Albümleri yönetin ve yeni fotoğraflar ekleyin.</p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-red-900 hover:bg-red-800">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Albüm Ekle
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-0 overflow-y-auto">
                        <div className="p-8">
                            <SheetHeader className="mb-8">
                                <SheetTitle className="text-2xl font-bold">Yeni Albüm Oluştur</SheetTitle>
                                <SheetDescription className="text-slate-500 dark:text-slate-400">
                                    Yeni bir fotoğraf albümü oluşturun. Daha sonra içini fotoğraflarla doldurabilirsiniz.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="bg-white dark:bg-slate-900 rounded-xl">
                                <GalleryForm />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {galleries.length === 0 ? (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <ImageIcon className="mx-auto h-16 w-16 text-slate-300" />
                        <h3 className="mt-6 text-xl font-bold text-slate-900">Henüz albüm yok</h3>
                        <p className="text-slate-500 mt-2">İlk albümünüzü yukarıdaki butonla hemen oluşturun.</p>
                    </div>
                ) : (
                    galleries.map((gallery: any) => (
                        <Card key={gallery.id} className="overflow-hidden group border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl">
                            <div className="relative aspect-video">
                                {gallery.coverImage ? (
                                    <Image
                                        src={gallery.coverImage}
                                        alt={gallery.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-slate-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-red-900/90 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm shadow-lg">
                                    {gallery._count.images} FOTOĞRAF
                                </div>
                            </div>
                            <CardHeader className="p-5">
                                <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-red-900 transition-colors">
                                    {gallery.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px] mt-2 text-slate-600 leading-relaxed">
                                    {gallery.description || "Açıklama belirtilmemiş."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="p-5 pt-0 flex justify-between gap-3">
                                <Button variant="outline" size="sm" asChild className="flex-1 font-bold border-slate-300 hover:border-red-900 hover:text-red-900 transition-all">
                                    <Link href={`/admin/gallery/${gallery.id}`}>
                                        <Edit className="mr-2 h-4 w-4" /> Düzenle
                                    </Link>
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" asChild title="Sitede Gör" className="border-slate-300 hover:bg-slate-50">
                                        <Link href={`/galeri/${gallery.slug}`} target="_blank">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <form action={async () => {
                                        'use server';
                                        await deleteGallery(gallery.id);
                                    }}>
                                        <Button variant="outline" size="icon" className="text-red-600 border-red-100 hover:bg-red-50 hover:border-red-600 transition-all" title="Sil">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
