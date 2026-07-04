"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getPageBySlug, updatePage } from "@/actions/page-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import LocalMultiUpload from "@/components/admin/local-multi-upload";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function EditPage({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [panoramaImage, setPanoramaImage] = useState<string | null>(null);

    // Fetch existing data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const page = await getPageBySlug(params.slug);
                if (page) {
                    setTitle(page.title);
                    setContent(page.content || "");
                    const p = page as any; // Temporary cast until Prisma client types sync

                    // Panorama görselini yükle
                    if (p.panoramaImage) {
                        setPanoramaImage(p.panoramaImage);
                    }

                    if (p.images) {
                        try {
                            setImages(JSON.parse(p.images));
                        } catch (e) {
                            setImages([]);
                        }
                    }
                } else {
                    // Default values if page doesn't exist in DB yet
                    // Only set default title based on slug for better UX
                    const defaultTitles: Record<string, string> = {
                        "tarihce": "Tarihçe",
                        "yonetim": "Yönetim Kurulu",
                        "yonetim-kurulu": "Yönetim Kurulu",
                        "iletisim": "İletişim",
                        "hakkimizda": "Hakkımızda",
                        "misyon-vizyon": "Misyon ve Vizyon",
                        "tuzuk": "Dernek Tüzüğü",
                        "gizlilik": "KVKK ve Gizlilik",
                        "uyelik": "Üyelik Başvurusu",
                        "kultur-evi": "Kültür Evi Tanıtımı"
                    };
                    setTitle(defaultTitles[params.slug] || params.slug);
                }
            } catch (error) {
                console.error(error);
                toast.error("Veri yüklenirken hata oluştu");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.slug]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            // Kullanıcı isteğine göre images array'ini string'e çevirerek gönderiyoruz
            // Backend de (page-actions) artık hem string hem array kabul edecek şekilde güncellendi
            const payload = {
                title,
                content,
                images: JSON.stringify(images),
                panoramaImage: panoramaImage || undefined
            };
            const result = await updatePage(params.slug, payload);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/pages">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sayfa Düzenle</h1>
                        <p className="text-muted-foreground text-sm">
                            /{params.slug} sayfasını düzenliyorsunuz.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" asChild>
                        <Link href={`/${params.slug}`} target="_blank">
                            Önizle
                        </Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Değişiklikleri Kaydet
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Sayfa Başlığı</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Sayfa başlığı giriniz..."
                            />
                        </div>

                        {/* 360° Sanal Tur Görseli Yükleme Alanı */}
                        <div className="mt-4 border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900">360° Sanal Tur Görseli</h3>
                                <p className="text-sm text-slate-500">Mekanın sanal turu için Eşdikdörtgensel (2:1) panorama fotoğrafı yükleyin.</p>
                            </div>

                            {panoramaImage ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-40 mb-4 bg-black">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={panoramaImage} alt="Panorama Önizleme" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setPanoramaImage(null)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                                        title="Görseli Kaldır"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <LocalMultiUpload
                                    multiple={false}
                                    buttonLabel="Panorama Fotoğrafı Seç"
                                    onUrls={(urls) => {
                                        if (urls[0]) {
                                            setPanoramaImage(urls[0]);
                                            toast.success("Sanal tur görseli yüklendi.");
                                        } else {
                                            toast.error("Görsel yüklenemedi.");
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label>Sayfa Galerisi (Albüm)</Label>
                            <p className="text-sm text-muted-foreground mb-4">
                                Kültür evi veya sayfa içeriği için birden fazla fotoğraf seçip yükleyebilirsiniz (Maks. 10 adet).
                            </p>

                            {/* Yükleme Bölgesi */}
                            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-4 mb-6">
                                <LocalMultiUpload
                                    onUrls={(urls) => {
                                        if (urls.length > 0) {
                                            setImages((prev) => [...prev, ...urls]);
                                            toast.success(`${urls.length} görsel albüme eklendi`);
                                        } else {
                                            toast.error("Hiçbir görsel yüklenemedi.");
                                        }
                                    }}
                                />
                            </div>

                            {/* Albüm (Grid) Önizlemesi */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                                            <Image
                                                src={url}
                                                alt={`Gallery image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />

                                            {/* Sil Butonu (Hover durumunda çıkar) */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110 shadow-lg"
                                                    title="Fotoğrafı Sil"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>İçerik</Label>
                            <div className="min-h-[500px]">
                                <Editor
                                    content={content}
                                    onChange={setContent}
                                    placeholder="Sayfa içeriğini buraya yazın..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
